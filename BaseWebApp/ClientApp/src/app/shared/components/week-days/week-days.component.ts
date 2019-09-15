import { Component, Input, HostBinding, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-week-days',
  templateUrl: './week-days.component.html',
  styleUrls: ['./week-days.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeekDaysComponent),
      multi: true
    }
  ]
})

export class WeekDaysComponent implements ControlValueAccessor {

  @Input() rowCss = 'col-sm-12';
  @Input() label: string;
  @Input() disabled = false;
  @HostBinding('style.opacity')
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }

  days: boolean[] = Array(7).fill(false);
  dayControls = [ 'L', 'M', 'M', 'J', 'V', 'S', 'D' ];

  onChange = (rating: string) => {};
  onTouched = () => {};

  set value(val) {
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  get value(): string {
    return this.days.reduce((total, starred) => {
      return total + (starred ? '1' : '0');
    }, '');
  }

  change(event: any, day: number) {
    if (!this.disabled) {
      this.days[day] = event.target.checked;
      this.onChange(this.value);
    }
  }

  writeValue(value: string) {
    this.days = this.days.map((_, i) => value[i] === '1');
    this.onChange(this.value);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  constructor() { }
}
