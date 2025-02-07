import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderComponent } from 'src/app/shared/ui/loader/loader.component';
import { TransactionComponent } from 'src/app/shared/widget/transaction/transaction.component';
import { emailSentBarChart, monthlyEarningChart } from '../default/data';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { adduserlist, deleteuserlist, fetchuserlistData, updateuserlist } from 'src/app/store/UserList/userlist.action';
import { Validators } from 'ngx-editor';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { selectData } from 'src/app/store/UserList/userlist-selector';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { Project } from '../../projects/project.model';
import { fetchprojectData } from 'src/app/store/ProjectsData/project.actions';
@Component({
  selector: 'app-predictedge',
  templateUrl: './predictedge.component.html',
  styleUrl: './predictedge.component.css',
   standalone:true,
    imports:[LoaderComponent,CommonModule,NgApexchartsModule,BsDropdownModule,ModalModule,FormsModule, PaginationModule, ReactiveFormsModule]
})
export class PredictedgeComponent {
// bread crumb items
breadCrumbItems: Array<{}>;
term: any
contactsList: any
// Table data
total: Observable<number>;
createContactForm!: UntypedFormGroup;
returnedArray: any
projectData: any
// Table data
content?: any;
orderes?: any;
ordersList!: Observable<Project[]>;
page: any = 1;
endItem: any = 12;
@ViewChild('newContactModal', { static: false }) newContactModal?: ModalDirective;
@ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
deleteId: any;

constructor(private modalService: BsModalService, private formBuilder: UntypedFormBuilder, public store: Store) {
}

ngOnInit() {
  this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects Grid', active: true }];

  this.store.dispatch(fetchprojectData());
  this.store.select(selectData).subscribe(data => {
    this.projectData = data;
    console.log(this.projectData)
    this.returnedArray = data;
    this.projectData = this.returnedArray.slice(0, 9);
  });
  this.createContactForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    position: ['', [Validators.required]],
    tags: ['', [Validators.required]],
    profile: ['', [Validators.required]],
  })
}

  // page change event
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.projectData = this.returnedArray.slice(startItem, this.endItem);
  }

// File Upload
imageURL: string | undefined;
fileChange(event: any) {
  let fileList: any = (event.target as HTMLInputElement);
  let file: File = fileList.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.imageURL = reader.result as string;
    document.querySelectorAll('#member-img').forEach((element: any) => {
      element.src = this.imageURL;
    });
    this.createContactForm.controls['profile'].setValue(this.imageURL);
  }
  reader.readAsDataURL(file)
}

// Save User
saveUser() {
  if (this.createContactForm.valid) {
    if (this.createContactForm.get('id')?.value) {
      const updatedData = this.createContactForm.value;
      this.store.dispatch(updateuserlist({ updatedData }));
    } else {
      this.createContactForm.controls['id'].setValue((this.contactsList.length + 1).toString());
      const newData = this.createContactForm.value;
      this.store.dispatch(adduserlist({ newData }));
    }
  }
  this.newContactModal?.hide()
  document.querySelectorAll('#member-img').forEach((element: any) => {
    element.src = 'assets/images/users/user-dummy-img.jpg';
  });

  setTimeout(() => {
    this.createContactForm.reset();
  }, 1000);
}

// fiter job
searchJob() {
  if (this.term) {
    this.contactsList = this.returnedArray.filter((data: any) => {
      return data.name.toLowerCase().includes(this.term.toLowerCase())
    })
  } else {
    this.contactsList = this.returnedArray
  }
}
  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  // changeLayout(layout: string) {
  //   this.eventService.broadcast('changeLayout', layout);
  // }
}