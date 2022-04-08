import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timestamp } from 'rxjs/operators';
import { Booking } from '../app.interface';
import { AppStateService } from '../services/app-state.service';
import { BookingService, ListBookingsSuccessResponse, ListTimeSlotResponse } from '../services/booking.service';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'tatoo-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  isLoading: boolean = true; 
  requests: Booking[]; 
  currentBooking: Booking; 
  formGroup: FormGroup; 
  timeFormGroup: FormGroup; 

  times: Date[]; 

  private _displayApprovalModal = false; 
  private _displayTimeSlotModal = false; 
  private _displaySelectTimeModal = false; 

  constructor(
    private _bookingService: BookingService, 
    private _appStateService: AppStateService, 
    private _userStateService: UserStateService, 
    private _formBuilder: FormBuilder
  ) { }

    calendars=['date_1', 'date_2', 'date_3']

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      'price': ['', [Validators.required, Validators.max(10000), Validators.min(1)]]
    })

    this.timeFormGroup = this._formBuilder.group({
      'date_1': ['', [Validators.required]], 
      'date_2': ['', [Validators.required]], 
      'date_3': ['', [Validators.required]]
    })

    this._bookingService.listBookings().subscribe(
      () => {
        this.isLoading = false; 
      }, 
      () => {
        this.isLoading = false; 
        this._appStateService.displayErrorModal = true; 
      }
    ); 

    this._bookingService.listRequests().subscribe(
      (res: ListBookingsSuccessResponse) => {
        this.requests = res.bookings
      }
    )
  }

  get bookings(): Booking[] {
    return this._bookingService.loadedBookings; 
  }

  labelText(bool: boolean): string {
    return bool ? 'Approved' : 'Pending'
  }

  tooltipMessage(type: "price" | "description", booking: Booking): string {
    if (this._userStateService.profileId === booking.client_id) {
      if (type === "price" && (!booking.price || booking.price == 0)) {
        return "Artist has not set price"
      }
      else if (type === "description" && !booking.design_approved) {
        return "Artist has not accepted appointment"
      }
    }
    else {

    }
  }

  requestMessage(type: "price" | "description", booking: Booking): string {
    if (this._userStateService.profileId === booking.artist_id) {
      if (type === "price" && (!booking.price || booking.price == 0)) {
        return "Approved request to move forward"
      }
      else if (type === "description" && !booking.design_approved) {
        return "Approve request to move forward"
      }
      if (type === "price" && booking.price > 0 && booking.price_approved == false) {
        return "Awaiting customer approval"
      }
    }
  }

  approveBooking(booking: Booking): void {
    this.displayApprovalModal = true; 
    this.currentBooking = booking;
  }

  get displayApprovalModal(): boolean {
    return this._displayApprovalModal;
  }

  set displayApprovalModal(input: boolean) {
    if (!input) {
      this.currentBooking = undefined; 
    }
    this._displayApprovalModal = input; 
  }

  get displayTimeSlotModal(): boolean { 
    return this._displayTimeSlotModal; 
  }

  set displayTimeSlotModal(input: boolean) {
    if (!input) { 
      this.currentBooking = undefined
    }
    this._displayTimeSlotModal = input; 
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const price = this.formGroup.controls['price'].value;
      this._bookingService.setPrice(this.currentBooking.booking_id, price).subscribe(
        () => {
          this.currentBooking.design_approved = true; 
          this.currentBooking.price = price;
          this.displayApprovalModal = false; 
        }, 
        () => {
          this._appStateService.displayErrorModal = true; 
        }
      ); 
    }
  }

  approvePrice(booking: Booking): void {
    this.currentBooking = booking; 
    this.displayTimeSlotModal = true;  
  }

  get dateList(): string[] {
    const times = []; 
      for (let i = 1; i <= 3; i++) {
        let date: Date = this.timeFormGroup.controls[`date_${i}`].value;
        times.push(date.toISOString())
      }
    return times; 
  }

  get datesUnique(): boolean {
    const dates = this.dateList; 
    if (this.dateList.length != 3) {
      return false; 
    }
    return (dates[0] !== dates[1] && dates[0] !== dates[2] && dates[1] !== dates[2])
  }

  submitAppointmentTime(): void {
    if (this.timeFormGroup.valid && this.datesUnique) {
      this._bookingService.approvePrice(this.currentBooking.booking_id).subscribe(
        () => {
          this.currentBooking.price_approved = true; 
        }
      )
      this._bookingService.schedule(this.currentBooking.booking_id, this.dateList).subscribe(
        () => {
          this.currentBooking.price_approved = true; 
          this.displayTimeSlotModal = false; 
        }
      )
    }
  }

  selectTime(booking: Booking): void {
    this.currentBooking = booking; 
    this.displaySelectTimeModal = true; 
  }

  get timeGroupDisabled(): boolean {
    return !(this.timeFormGroup.valid && this.datesUnique)
  }

  get displaySelectTimeModal(): boolean {
    return this._displaySelectTimeModal
  }

  set displaySelectTimeModal(input: boolean) {
    if (input) {
      this._bookingService.getTimes(this.currentBooking.booking_id).subscribe(
        (res: ListTimeSlotResponse) => {
          this.times = res.times
        }, 
        () => this._appStateService.displayErrorModal = true
      )
    }
    else {
      this.times = undefined; 
      this.currentBooking = undefined; 
    }

    this._displaySelectTimeModal = input; 
  } 

  submitSelectedTime(date: Date): void {
    this._bookingService.selectTime(this.currentBooking.booking_id, date).subscribe(
      () => {
        this.currentBooking.selected_date = date
      },
      () => {
        this._appStateService.displayErrorModal = true
      }
    )
  }

  formatDate(input: string): string {
    const date = new Date(input);
    return `${date.getUTCMonth()}/${date.getDate()} : ${date.getHours()}:${date.getMinutes()}`
  }

  timeslotButtonClass(date: string): string {
    return !!this.currentBooking.selected_date && this.currentBooking.selected_date.toString() === date  ? 'p-button-success' : 'p-button-secondary'
  }
}
