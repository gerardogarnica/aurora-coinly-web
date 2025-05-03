import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements OnInit {
  @Input() appAutofocus: boolean | '' = true;
  
  constructor(private elementRef: ElementRef) { }
  
  ngOnInit() {
    if (this.appAutofocus !== false) {
      setTimeout(() => {
        this.elementRef.nativeElement.focus();
      }, 0);
    }
  }
}
