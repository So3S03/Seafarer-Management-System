import { FilterByNamePipe } from './../../../core/pipes/filter-by-name.pipe';
import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, signal, ViewChild, WritableSignal } from '@angular/core';
import { SeafarerService } from '../../../core/services/seafarer.service';
import { Subscription } from 'rxjs';
import { ISeafarer } from '../../../core/interfaces/iseafarer';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterByNationalityPipe } from '../../../core/pipes/filter-by-nationality.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgxPaginationModule, FilterByNamePipe, FilterByNationalityPipe, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  public readonly _SeafarerService: SeafarerService = inject(SeafarerService);
  private readonly _FormBuilder: FormBuilder = inject(FormBuilder);
  private readonly _ToastrService: ToastrService = inject(ToastrService);
  private readonly _Renderer2: Renderer2 = inject(Renderer2);
  AllSeafarersSub!: Subscription;
  AllSeafarers: ISeafarer[] = [];
  @ViewChild("ModalClosedBtn") modalClsBtn!: ElementRef;
  @ViewChild("addSeafarer") modalOpenBtn!: ElementRef;
  activeTab = 'personal-data';
  isLoading: boolean = false;
  filterationFlag: boolean = false;
  NameFilter: string = "";
  NationalityFilter: string = "";
  // pagination Data
  totalSeafarer: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  resetForm(): void
  {
    this.seafarerData.reset();
  }

  setActive(tab: string) {
    this.activeTab = tab;
  }

  isFilteration(): void
  {
    if(this.filterationFlag) this.filterationFlag = false;
    else this.filterationFlag = true;
  }

  subAllSeafarer(): void {
    this.AllSeafarersSub = this._SeafarerService.getAllSeafarers().subscribe({
      next: res => {
        this.AllSeafarers = res;
        this.totalSeafarer = this.AllSeafarers.length; //this is wrong because this field should get it's value from APIs response 
      },
      error: err => {
        console.log(err)
      }
    })
  }

  pageChanged(index: number) {
    this.pageIndex = index;
    this.subAllSeafarer()
  }

  seafarerData: FormGroup = this._FormBuilder.group({
    entity: this._FormBuilder.group({
      Id: [0],
      PassPortIssueDate: [null],
      IDExPiryDate: [null],
      SeamanBookNO: [null],
      Remarks: [null],
      EmpId: [null, [Validators.required]],
      VisaSponsorId: [null, [Validators.required]],
      VisaIssueDate: [null],
      VisaExpiryDate: [null],
      NameOfSpouse: [null],
      NoOfChildren: [null],
      BodyWeight: [null],
      Height: [null],
      VisaUAEIdNO: [null],
      NearestAirport: [null],
      ResidenceNumber: [null],
      SkypeID: [null],
      PermanentAddressHomeCountry: [null],
      ContactNumberHomeCountry: [null],
      ContactNameAndNumberDuringEmergenciesUAE: [null],
      ContactNameAndNumberDuringEmergenciesHome: [null],
      SeamanIssueDate: [null],
      SeamanExpiryDate: [null],
      CicpaNO: [null],
      CicpaIssueDate: [null],
      CicpaExpiryDate: [null],
      Declaration: [null],
      SignedOffFromAShipDueToMedicalReason: [false],
      SignedOffFromAShipDueToMedicalReasonComment: [null],
      UndergoneAnyMdicalOperation: [false],
      UndergoneAnyMdicalOperationComment: [null],
      DoctorConsultation: [false],
      DoctorConsultationComment: [null],
      HealthOrDisabilityProblem: [false],
      HealthOrDisabilityProblemComment: [null],
      InquiryOrInvolvedMaritimeAccident: [false],
      InquiryOrInvolvedMaritimeAccidentComment: [null],
      LicenseSuspendedOrRevoked: [false],
      LicenseSuspendedOrRevokedComment: [null],
    }),

    Qualifications: this._FormBuilder.array([]),

    Certificates: this._FormBuilder.array([]),

    Languages: this._FormBuilder.array([]),

    References: this._FormBuilder.array([]),

    WorkExperiences: this._FormBuilder.array([])
  })

  Qualification: FormGroup = this._FormBuilder.group({
    DegreeOrCourse: [null],
    CourseIssueDate: [null],
    ExpiryDate: [null],
    MajorOrSubject: [null],
    University: [null],
    Country: [null],
    Type: [1]
  });

  Certificate: FormGroup = this._FormBuilder.group({
    Capacity: [null],
    Regulation: [null],
    IssueDate: [null],
    ExpiryDate: [null],
    IssuingAuthority: [null],
    Limitations: [null],
    Country: [null],
    Type: [1]
  });

  Language: FormGroup = this._FormBuilder.group({
    Capacity: [null],
    Regulation: [null],
    IssueDate: [null],
    ExpiryDate: [null],
    IssuingAuthority: [null],
    Limitations: [null],
    Country: [null]
  });

  Reference: FormGroup = this._FormBuilder.group({
    PersonName: [null],
    CompanyName: [null],
    Country: [null],
    Fax: [null],
    EmailId: [null]
  });

  WorkExperience: FormGroup = this._FormBuilder.group({
    VesselName: [null],
    VesselType: [null],
    Rank: [null],
    From: [null],
    To: [null],
    GRT: [null],
    BHP: [null],
    CompanyName: [null]
  });



  addQualifications(): void {
    let qualificationsArr = this.seafarerData.get("Qualifications") as FormArray;
    let currentQualification: FormGroup = this._FormBuilder.group({
      DegreeOrCourse: [this.Qualification.get("DegreeOrCourse")?.value],
      CourseIssueDate: [this.Qualification.get("CourseIssueDate")?.value],
      ExpiryDate: [this.Qualification.get("ExpiryDate")?.value],
      MajorOrSubject: [this.Qualification.get("MajorOrSubject")?.value],
      University: [this.Qualification.get("University")?.value],
      Country: [this.Qualification.get("Country")?.value],
      Type: [1]
    });
    qualificationsArr.push(currentQualification);
    this.Qualification.reset()
  }

  removeQualification(index: number): void {
    let qualificationsArr = this.seafarerData.get("Qualifications") as FormArray;
    qualificationsArr.removeAt(index);
  }


  addCertificate(): void {
    let CertificatesArr: FormArray = this.seafarerData.get("Certificates") as FormArray;
    let currentCertificate: FormGroup = this._FormBuilder.group({
      Capacity: [this.Certificate.get("Capacity")?.value],
      Regulation: [this.Certificate.get("Regulation")?.value],
      IssueDate: [this.Certificate.get("IssueDate")?.value],
      ExpiryDate: [this.Certificate.get("ExpiryDate")?.value],
      IssuingAuthority: [this.Certificate.get("IssuingAuthority")?.value],
      Limitations: [this.Certificate.get("Limitations")?.value],
      Country: [this.Certificate.get("Country")?.value],
      Type: [1]
    })
    CertificatesArr.push(currentCertificate);
    this.Certificate.reset();
  }

  removeCertificate(CIndex: number): void {
    let CertificatesArr: FormArray = this.seafarerData.get("Certificates") as FormArray;
    CertificatesArr.removeAt(CIndex);
  }


  addLanguage(): void {
    let languagesArr: FormArray = this.seafarerData.get("Languages") as FormArray;
    let currentLanguage: FormGroup = this._FormBuilder.group({
      Capacity: [this.Language.get("Capacity")?.value],
      Regulation: [this.Language.get("Regulation")?.value],
      IssueDate: [this.Language.get("IssueDate")?.value],
      ExpiryDate: [this.Language.get("ExpiryDate")?.value],
      IssuingAuthority: [this.Language.get("IssuingAuthority")?.value],
      Limitations: [this.Language.get("Limitations")?.value],
      Country: [this.Language.get("Country")?.value]
    });
    languagesArr.push(currentLanguage);
    this.Language.reset()
  }

  removeLanguage(LIndex: number): void {
    let languagesArr: FormArray = this.seafarerData.get("Languages") as FormArray;
    languagesArr.removeAt(LIndex);
  }


  addReference(): void {
    let ReferencesArr: FormArray = this.seafarerData.get("References") as FormArray;
    let currentReference: FormGroup = this._FormBuilder.group({
      PersonName: [this.Reference.get("PersonName")?.value],
      CompanyName: [this.Reference.get("CompanyName")?.value],
      Country: [this.Reference.get("Country")?.value],
      Fax: [this.Reference.get("Fax")?.value],
      EmailId: [this.Reference.get("EmailId")?.value]
    });
    ReferencesArr.push(currentReference);
    this.Reference.reset()
  }

  removeReference(RIndex: number): void {
    let referencesArr: FormArray = this.seafarerData.get("References") as FormArray;
    referencesArr.removeAt(RIndex);
  }


  addWorkExperience(): void {
    let workExperiencesArr: FormArray = this.seafarerData.get("WorkExperiences") as FormArray;
    let currentWorkExperience: FormGroup = this._FormBuilder.group({
      VesselName: [this.WorkExperience.get("VesselName")?.value],
      VesselType: [this.WorkExperience.get("VesselType")?.value],
      Rank: [this.WorkExperience.get("Rank")?.value],
      From: [this.WorkExperience.get("From")?.value],
      To: [this.WorkExperience.get("To")?.value],
      GRT: [this.WorkExperience.get("GRT")?.value],
      BHP: [this.WorkExperience.get("BHP")?.value],
      CompanyName: [this.WorkExperience.get("CompanyName")?.value]
    });
    workExperiencesArr.push(currentWorkExperience);
    this.WorkExperience.reset()
  }

  removeWorkExperience(WEIndex: number): void {
    let workExperiencesArr: FormArray = this.seafarerData.get("WorkExperiences") as FormArray;
    workExperiencesArr.removeAt(WEIndex);
  }

  ngOnInit(): void {
    this.subAllSeafarer();
  }

  onCheckBoxsChange(e: Event, checkBoxCommentId: string, formControlName: string): void {
    const ele = e.target as HTMLInputElement;
    const elementComment = document.getElementById(checkBoxCommentId) as HTMLInputElement;
    if (ele.checked) {
      this._Renderer2.removeAttribute(elementComment, "hidden");
    }
    else {
      this._Renderer2.setAttribute(elementComment, "hidden", 'true');
      this.seafarerData.get("entity")?.get(formControlName)?.reset();
    }
  }

  submitData(): void {
    if (this.seafarerData.invalid) return;
    this.isLoading = true;
    this._SeafarerService.addNewSeafarer(this.seafarerData.value).subscribe({
      next: res => {
        if (res.Result === true) {
          this._ToastrService.success("New seafarer has been added", "Success!");
          this.seafarerData.reset();
          this.modalClsBtn.nativeElement.click();
          this.subAllSeafarer();
        }
        else if (res.Result === false) {
          this._ToastrService.error(`This ${res.ErrorMessage}`, "Erorr!");
        }
        this.isLoading = false;
      },
      error: err => {
        console.log(err);
        this._ToastrService.error("Something went wrong while adding this seafarer", "Erorr!");
        this.isLoading = false;
      }
    })
  }

  setSeafarerDataToUpdate(Id: number) {
    let seafarer: any;
    if (Id > 0) seafarer = this.AllSeafarers.find(s => s.Id === Id);
    if (seafarer !== undefined) {
      let form = this._FormBuilder.group({
        Id: [seafarer.Id],
        PassPortIssueDate: [seafarer.PassPortIssueDate],
        IDExPiryDate: [null],
        SeamanBookNO: [seafarer.SeamanBookNo],
        Remarks: [seafarer.Remarks],
        EmpId: [seafarer.EmpId, [Validators.required]],
        VisaSponsorId: [seafarer.VisaSponsorId, [Validators.required]],
        VisaIssueDate: [seafarer.VisaIssueDate ? seafarer.VisaIssueDate.split("T")[0] : null],
        VisaExpiryDate: [seafarer.VisaExpiryDate ? seafarer.VisaExpiryDate.split("T")[0] : null],
        NameOfSpouse: [seafarer.NameOfSpouse],
        NoOfChildren: [seafarer.NoOfChilren],
        BodyWeight: [seafarer.BodyWeight],
        Height: [seafarer.Height],
        VisaUAEIdNO: [seafarer.VisaUAEIdNO],
        NearestAirport: [seafarer.NearestAirport],
        ResidenceNumber: [seafarer.ResidenceNumber],
        SkypeID: [seafarer.SkypeID],
        PermanentAddressHomeCountry: [seafarer.PermanentAddressHomeCountry],
        ContactNumberHomeCountry: [seafarer.ContactNumberHomeCountry],
        ContactNameAndNumberDuringEmergenciesUAE: [seafarer.ContactNameAndNumberDuringEmergenciesUAE],
        ContactNameAndNumberDuringEmergenciesHome: [seafarer.ContactNameAndNumberDuringEmergenciesHome],
        SeamanIssueDate: [seafarer.SeamanIssueDate ? seafarer.SeamanIssueDate.split("T")[0] : null],
        SeamanExpiryDate: [seafarer.SeamanExpiryDate ? seafarer.SeamanExpiryDate.split("T")[0] : null],
        CicpaNO: [seafarer.CicpaNO],
        CicpaIssueDate: [seafarer.CicpaIssueDate ? seafarer.CicpaIssueDate.split("T")[0] : null],
        CicpaExpiryDate: [seafarer.CicpaExpiryDate ? seafarer.CicpaExpiryDate.split("T")[0] : null],
        Declaration: [seafarer.Declaration],
        SignedOffFromAShipDueToMedicalReason: [seafarer.SignedOffFromAShipDueToMedicalReason],
        SignedOffFromAShipDueToMedicalReasonComment: [seafarer.SignedOffFromAShipDueToMedicalReasonComment],
        UndergoneAnyMdicalOperation: [seafarer.UndergoneAnyMdicalOperation],
        UndergoneAnyMdicalOperationComment: [seafarer.UndergoneAnyMdicalOperationComment],
        DoctorConsultation: [seafarer.DoctorConsultation],
        DoctorConsultationComment: [seafarer.DoctorConsultationComment],
        HealthOrDisabilityProblem: [seafarer.HealthOrDisabilityProblem],
        HealthOrDisabilityProblemComment: [seafarer.HealthOrDisabilityProblemComment],
        InquiryOrInvolvedMaritimeAccident: [seafarer.InquiryOrInvolvedMaritimeAccident],
        InquiryOrInvolvedMaritimeAccidentComment: [seafarer.InquiryOrInvolvedMaritimeAccidentComment],
        LicenseSuspendedOrRevoked: [seafarer.LicenseSuspendedOrRevoked],
        LicenseSuspendedOrRevokedComment: [seafarer.LicenseSuspendedOrRevokedComment],
      })
      this.seafarerData.get("entity")?.patchValue(form.value);
      this.modalOpenBtn.nativeElement.click()
    }
  }

  activeInActiveCheck(seafarerId: number, ele: Event): void {
    let btn = ele.target as HTMLInputElement;
    let status: 1 | 2;
    if (btn.checked) status = 1
    else status = 2
    if (seafarerId > 0) {
      this._SeafarerService.seafarerStatus(status, seafarerId).subscribe({
        next: res => {
          console.log(res);
          if (res.Result === true) this._ToastrService.success("Seafarer status has been updated");
          else this._ToastrService.error(`Seafarer status didn't change ${res.ErrorMessage}`)
        },
        error: err => {
          console.log(err);
          this._ToastrService.error("Something went wrong while changing this seafarer status", "Error")
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.AllSeafarersSub.unsubscribe();
    this.AllSeafarers = [];
  }
}
