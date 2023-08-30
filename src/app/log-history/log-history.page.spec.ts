import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogHistoryPage } from './log-history.page';

describe('LogHistoryPage', () => {
  let component: LogHistoryPage;
  let fixture: ComponentFixture<LogHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
