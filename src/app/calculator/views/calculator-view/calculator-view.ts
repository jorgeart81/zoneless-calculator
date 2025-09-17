import { Component } from '@angular/core';
import { Calculator } from "@/calculator/components/calculator/calculator";

@Component({
  selector: 'calculator-view',
  imports: [Calculator],
  templateUrl: './calculator-view.html',
  host: { class: 'w-full max-w-[300px] mx-auto rounded-xl bg-gray-100 shadow-xl text-gray-800 relative overflow-hidden' },
})
export default class CalculatorView { }
