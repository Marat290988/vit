import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DirectiveModule } from "src/app/directives/directive.module";
import { AuthComponent } from './auth/auth.component';


@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        DirectiveModule
    ],
    exports: [
        AuthComponent
    ]
})
export class AuthModule{};