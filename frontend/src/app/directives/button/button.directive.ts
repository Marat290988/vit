import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[button]'
})
export class ButtonDirective {
    @HostListener('pointerdown', ['$event'])
    public onClick(event) {
        let x = event.clientX  - event.target.getBoundingClientRect().left;
		let y = event.clientY  - event.target.getBoundingClientRect().top;
		let ripple = document.createElement('span');
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		event.target.appendChild(ripple);
		setTimeout(function(){
			ripple.remove();
		}, 600);
    }
}