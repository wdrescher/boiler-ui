import { TestBed, async, inject } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { AppStateService } from './services/app-state.service';


describe('AppComponent', () => {
  let ngConfig: PrimeNGConfig;
  const events = new Subject<RouterEvent>(); 

  let fixture; 

  const routerMock = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    events: events.asObservable(),
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // RouterTestingModule
      ],
      declarations: [
        AppComponent
      ], 
      providers: [
        AppStateService, 
        {provide: Router, useValue: routerMock}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'peek'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('peek');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.peek').textContent).toContain('Something went wrong.');
  });

  it('should correctly add set loader for different navigation states', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance; 
    app.ngOnInit();
    // expect(app.isLoading).toBe(false);
    events.next(new NavigationEnd(0, "/", "/")); 
    expect(app.isLoading).toBe(false);
    events.next(new NavigationStart(1, "/", "imperative"));
    expect(app.isLoading).toBe(true);
    events.next(new NavigationEnd(1, "/", "/")); 
    expect(app.isLoading).toBe(false);
  })
});
