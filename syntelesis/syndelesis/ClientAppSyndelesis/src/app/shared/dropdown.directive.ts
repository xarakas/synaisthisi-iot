import { 
  Directive,
  HostListener,
  HostBinding,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit{
  @HostBinding('class.open') isOpen: boolean;
  
  constructor() { }

  ngOnInit() {
    this.isOpen = false;
  }

  @HostListener('click') toggleOpen(eventData: Event){
    this.isOpen = !this.isOpen;
  }
}
