import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthComponent } from './auth/auth.component';


@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule
    ],
    exports: [
        AuthComponent
    ]
})
export class AuthModule{};