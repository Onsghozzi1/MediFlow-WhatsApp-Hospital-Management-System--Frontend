import {
  Component,
  OnInit,
  ElementRef,
  viewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Consultations } from '../../services/consultations';
import { PatientService } from '../../../patients/services/patient-service';

import { MatDialogRef } from '@angular/material/dialog';

import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-consultation-shell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation-shell.html',
  styleUrl: './consultation-shell.css',
})
export class ConsultationShell implements OnInit {

  terminalBody = viewChild<ElementRef>('terminalBody');
  bottomAnchor = viewChild<ElementRef>('bottomAnchor');

  // ====================================================
  // STATE
  // ====================================================

  selectedPatientId!: number;

  isPatientSelected = false;

  consultationBlocked = false;

  filteredPatients: any[] = [];

  selectedPatient: any = null;

  list_patient: any = [];

  appointmentId: any;

  // ====================================================
  // PRESCRIPTIONS
  // ====================================================

  prescriptions: any[] = [];

  currentPrescription: any = {

    medicineName: '',

    dosage: '',

    frequency: '',

    duration: '',

    instructions: ''

  };

  // ====================================================
  // QUESTIONS
  // ====================================================

  questions = [

    'Enter patient full name',

    'What are the patient symptoms?',

    'When did it start?',

    'Rate the pain from 1 to 10',

    'Does the patient have any allergies?',

    'Is the patient currently taking any medications?',

    'What is the patient body temperature?',

    'What is the patient heart rate?',

    'What is the patient blood pressure?',

    'What is the diagnosis?',

    // ==========================================
    // PRESCRIPTION
    // ==========================================

    'Medicine name?',

    'Dosage?',

    'Frequency?',

    'Duration?',

    'Instructions?',

    'Add another prescription? yes/no'

  ];

  // ====================================================
  // TERMINAL STATE
  // ====================================================

  currentQuestionIndex = 0;

  terminalLines: string[] = [];

  userInput = '';

  answers: any[] = [];

  consultationId: number | null = null;

  isSaving = false;

  constructor(
    private consultationService: Consultations,
    private patient_service: PatientService,
    private dialogRef: MatDialogRef<ConsultationShell>
  ) { }

  // ====================================================
  // INIT
  // ====================================================

  ngOnInit(): void {

    this.getPatient();

    this.addLine('> Starting consultation...');
  }

  // ====================================================
  // SCROLL
  // ====================================================

  private scrollToBottom(): void {

    setTimeout(() => {

      this.bottomAnchor()
        ?.nativeElement
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });

    });
  }

  private addLine(message: string): void {

    this.terminalLines.push(message);

    this.scrollToBottom();
  }

  // ====================================================
  // GET PATIENTS
  // ====================================================

  getPatient(): void {

    this.patient_service
      .Consultation_patient()
      .subscribe((data: any) => {

        this.list_patient =
          Array.isArray(data)
            ? data
            : [data];

        if (
          this.list_patient.length > 0 &&
          this.list_patient[0].activeAppointment === false
        ) {

          this.consultationBlocked = true;

          this.addLine(
            '> No active consultation right now.'
          );

          const nextTime =
            this.list_patient[0].nextAppointmentTime;

          if (nextTime) {

            const formatted =
              new Date(nextTime)
                .toLocaleString('en-US');

            this.addLine(
              '> Next appointment at: ' + formatted
            );
          }

          return;
        }

        setTimeout(() => {

          this.askQuestion();

        }, 500);

      });
  }

  // ====================================================
  // ASK QUESTION
  // ====================================================

  askQuestion(): void {

    if (this.consultationBlocked) {

      this.addLine('> Consultation paused');

      return;
    }

    if (!this.isPatientSelected) {

      this.addLine(
        '> Enter patient full name'
      );

      return;
    }

    if (
      this.currentQuestionIndex <
      this.questions.length
    ) {

      this.addLine(
        '> ' +
        this.questions[this.currentQuestionIndex]
      );

    } else {

      this.addLine(
        '> Consultation completed.'
      );

      this.saveConsultation();
    }
  }

  // ====================================================
  // SUBMIT ANSWER
  // ====================================================

  submitAnswer(): void {

    if (this.consultationBlocked) return;

    if (!this.userInput.trim()) return;

    const answer =
      this.userInput.trim();

    const currentQuestion =
      this.questions[this.currentQuestionIndex]
        .toLowerCase();

    this.addLine('> ' + answer);

    // ====================================================
    // PATIENT SEARCH
    // ====================================================

    if (!this.isPatientSelected) {

      const patient =
        this.list_patient.find((p: any) =>

          (p?.full_name_patient ||
            p?.full_name ||
            '')

            .toLowerCase()

            .includes(
              answer.toLowerCase()
            )
        );

      if (!patient) {

        this.addLine(
          '> Patient not found'
        );

        this.userInput = '';

        return;
      }

      this.selectedPatientId =
        patient.patientId;

      this.appointmentId =
        patient.appointmentId;

      this.isPatientSelected = true;

      this.addLine(
        '> Patient selected'
      );

      this.startConsultationFlow();

      this.userInput = '';

      return;
    }

    // ====================================================
    // NORMAL ANSWERS
    // ====================================================

    this.answers.push({

      question:
        this.questions[this.currentQuestionIndex],

      answer: answer

    });

    // ====================================================
    // PRESCRIPTION MAPPING
    // ====================================================

    if (currentQuestion.includes('medicine')) {

      this.currentPrescription.medicineName =
        answer;
    }

    else if (currentQuestion.includes('dosage')) {

      this.currentPrescription.dosage =
        answer;
    }

    else if (currentQuestion.includes('frequency')) {

      this.currentPrescription.frequency =
        answer;
    }

    else if (currentQuestion.includes('duration')) {

      this.currentPrescription.duration =
        answer;
    }

    else if (currentQuestion.includes('instructions')) {

      this.currentPrescription.instructions =
        answer;

      // ==========================================
      // SAVE PRESCRIPTION
      // ==========================================

      this.prescriptions.push({

        ...this.currentPrescription

      });

      // ==========================================
      // SAVE PRESCRIPTION IN ANSWERS
      // ==========================================

      this.answers.push({

        question: 'Prescription',

        answer:

          'Medicine: ' +
          this.currentPrescription.medicineName +

          ' | Dosage: ' +
          this.currentPrescription.dosage +

          ' | Frequency: ' +
          this.currentPrescription.frequency +

          ' | Duration: ' +
          this.currentPrescription.duration +

          ' | Instructions: ' +
          this.currentPrescription.instructions

      });

      // RESET

      this.currentPrescription = {

        medicineName: '',

        dosage: '',

        frequency: '',

        duration: '',

        instructions: ''

      };
    }

    // ====================================================
    // MANY PRESCRIPTIONS
    // ====================================================

    if (
      currentQuestion.includes(
        'another prescription'
      )
    ) {

      if (
        answer.toLowerCase() === 'yes'
      ) {

        // RETURN TO MEDICINE QUESTION

        this.currentQuestionIndex = 10;

      } else {

        this.currentQuestionIndex++;
      }

      this.userInput = '';

      setTimeout(() => {

        this.askQuestion();

      }, 200);

      return;
    }

    // ====================================================
    // NEXT QUESTION
    // ====================================================

    this.currentQuestionIndex++;

    this.userInput = '';

    setTimeout(() => {

      this.askQuestion();

    }, 200);
  }

  // ====================================================
  // START CONSULTATION
  // ====================================================

  startConsultationFlow(): void {

    if (!this.appointmentId) {

      this.addLine(
        '> No appointment selected'
      );

      return;
    }

    this.consultationService
      .startConsultation(this.appointmentId)

      .subscribe({

        next: (res: any) => {

          this.consultationId = res.id;

          this.userInput = '';

          // START FROM SYMPTOMS

          this.currentQuestionIndex = 1;

          this.askQuestion();
        },

        error: (err) => {

          console.error(err);

          this.addLine(
            '> Error starting consultation'
          );
        }

      });
  }

  // ====================================================
  // SAVE CONSULTATION
  // ====================================================

  saveConsultation(): void {

    if (!this.consultationId) {

      this.addLine(
        '> Missing consultation ID'
      );

      return;
    }

    this.isSaving = true;

    const payload = {

      consultationId:
        this.consultationId,

      patientId:
        this.selectedPatientId,

      appointmentId:
        this.appointmentId,

      answers:
        this.answers,

      prescriptions:
        this.prescriptions
    };

    this.consultationService
      .saveAnswer(payload)

      .pipe(

        tap(() => {

          this.addLine(
            '> Consultation answers saved'
          );

        }),

        switchMap(() =>

          this.consultationService
            .endConsultation(
              this.consultationId!
            )
        )

      )

      .subscribe({

        next: () => {

          this.isSaving = false;

          this.addLine(
            '> Consultation completed successfully'
          );

          this.addLine(
            '> Appointment status changed to COMPLETED'
          );
        },

        error: (err) => {

          this.isSaving = false;

          console.error(err);

          this.addLine(
            '> Error while completing consultation'
          );
        }

      });
  }

  // ====================================================
  // AUTOCOMPLETE
  // ====================================================

  onTyping(): void {

    const value =
      this.userInput
        ?.toLowerCase()
        .trim() || '';

    if (!value) {

      this.filteredPatients = [];

      return;
    }

    this.filteredPatients =
      this.list_patient.filter((p: any) =>

        (p?.full_name_patient || '')

          .toLowerCase()

          .includes(value)
      );
  }

  // ====================================================
  // SELECT PATIENT
  // ====================================================

  selectPatient(patient: any): void {

    this.selectedPatientId =
      patient.patientId;

    this.appointmentId =
      patient.appointmentId;

    this.userInput =
      patient.full_name_patient;

    this.isPatientSelected = true;

    this.filteredPatients = [];

    this.addLine(

      '> Patient selected: ' +

      patient.full_name_patient

    );

    this.startConsultationFlow();
  }

  // ====================================================
  // CLOSE
  // ====================================================

  closeTerminal(): void {

    this.dialogRef.close();
  }
}