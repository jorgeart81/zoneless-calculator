import { TestBed } from '@angular/core/testing'
import { Calculate } from './calculate'

describe('Calculate service', () => {
  let service: Calculate

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [Calculate] })
    service = new Calculate()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should be created with default values', () => {
    expect(service.resultText()).toBe('0')
    expect(service.subResultText()).toBe('0')
    expect(service.lastOperatorText()).toBe('+')
  })

  it("should be subResultText to '0' when 'C' is pressed", () => {
    service.subResultText.set('9')
    service.setKey('Clear').startCalculation()

    expect(service.subResultText()).toBe('0')
  })

  it("should be resultText to '0' when 'C' is pressed", () => {
    service.resultText.set('9')
    service.setKey('Clear').startCalculation()

    expect(service.resultText()).toBe('0')
  })

  it("should update resultText with number input", () => {
    service.setKey('2').startCalculation()
    service.setKey('.').startCalculation()
    service.setKey('1').startCalculation()

    expect(service.resultText()).toBe('2.1')

    service.setKey('9').startCalculation()
    expect(service.resultText()).toBe('2.19')
  })

  it("should handle operator correctly", () => {
    service.setKey('2').startCalculation()
    service.setKey('+').startCalculation()

    expect(service.lastOperatorText()).toBe('+')
    expect(service.subResultText()).toBe('2')
    expect(service.resultText()).toBe('0')

    service.setKey('-').startCalculation()
    expect(service.lastOperatorText()).toBe('-')
  })

  it("should calculate result correctly for addition", () => {
    service.setKey('2').startCalculation()
    service.setKey('+').startCalculation()
    service.setKey('2').startCalculation()
    service.setKey('Enter').startCalculation()

    expect(service.resultText()).toBe('4')

    service.setKey('+').startCalculation()
    service.setKey('6').startCalculation()
    service.setKey('Enter').startCalculation()

    expect(service.resultText()).toBe('10')
  })

  it("should calculate result correctly for division", () => {
    service.setKey('2').startCalculation()
    service.setKey('0').startCalculation()
    service.setKey('/').startCalculation()
    service.setKey('2').startCalculation()
    service.setKey('Enter').startCalculation()

    expect(service.resultText()).toBe('10')
  })
})
