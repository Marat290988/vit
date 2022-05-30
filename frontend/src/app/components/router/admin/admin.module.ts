import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminUserComponent } from './admin-panel/admin-user/admin-user.component';
import { SpinnerComponent } from "../../ui/spinner/spinner.component";

@NgModule({
    declarations: [
        AdminPanelComponent,
        AdminUserComponent,
        SpinnerComponent
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
        ])
    ],
    exports: [
        SpinnerComponent
    ]
})
export class AdminModule {
    
}