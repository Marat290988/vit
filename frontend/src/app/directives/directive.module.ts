import { NgModule } from '@angular/core';
import { ButtonDirective } from './button/button.directive';

@NgModule({
    declarations: [
        ButtonDirective
    ],
    exports: [
        ButtonDirective
    ]
})
export class DirectiveModule {}