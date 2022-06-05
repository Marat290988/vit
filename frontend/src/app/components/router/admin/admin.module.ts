import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminUserComponent } from './admin-panel/admin-user/admin-user.component';
import { SpinnerComponent } from "../../ui/spinner/spinner.component";
import { AddEditUserComponent } from './admin-panel/admin-user/add-edit-user/add-edit-user.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectiveModule } from "src/app/directives/directive.module";

@NgModule({
    declarations: [
        AdminPanelComponent,
        AdminUserComponent,
        SpinnerComponent,
        AddEditUserComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminUserComponent
            },
            {
                path: 'admin-user',
                component: AdminUserComponent
            },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]),
        ReactiveFormsModule,
        FormsModule,
        DirectiveModule
    ],
    exports: [
        SpinnerComponent
    ]
})
export class AdminModule {
    
}