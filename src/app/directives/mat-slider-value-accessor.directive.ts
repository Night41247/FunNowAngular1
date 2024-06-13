import { Directive, forwardRef, HostListener, Renderer2, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';

@Directive({
  selector: 'mat-slider[formControlName], mat-slider[formControl], mat-slider[ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSliderValueAccessorDirective),
      multi: true
    }
  ]
})
export class MatSliderValueAccessorDirective implements ControlValueAccessor {
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(parseFloat(value));
    this.onTouched();
  }

  writeValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
