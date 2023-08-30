import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageListPage } from './page-list.page';

describe('PageListPage', () => {
  let component: PageListPage;
  let fixture: ComponentFixture<PageListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
