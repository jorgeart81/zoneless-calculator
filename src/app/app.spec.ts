import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    compiled = fixture.nativeElement;
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router-outlet', () => {
    expect(compiled.querySelector('router-outlet')).not.toBeNull()
  });

  it('should render router-outlet wrapper with css classes', () => {
    const divElement = compiled.querySelector('div')
    const mustHaveClasses = "min-w-screen min-h-screen bg-gray-600 flex items-center justify-center px-5 py-5".split(' ')

    expect(divElement).not.toBeNull()
    // divElement?.classList.forEach(className => expect(mustHaveClasses).toContain(className))

    const divClasses = divElement?.classList.value.split(' ')
    mustHaveClasses?.forEach(className => expect(divClasses).toContain(className))
  });

  it("should contain the 'buy me a beer' link", () => {
    const anchorElement = compiled.querySelector('a')
    const title = "Buy me a beer"
    const link = "https://www.buymeacoffee.com/scottwindon"

    expect(anchorElement).not.toBeNull()
    expect(anchorElement?.title).toBe(title)

    expect(anchorElement?.href).not.toBe(window.location.href)
    expect(anchorElement?.href.trim().length).toBeGreaterThan(0)
    expect(anchorElement?.href).toBe(link)
  });

});
