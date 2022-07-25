import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/main/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './components/auth/auth.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AuthStoreModule } from './store/auth-store.module';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserService } from './services/user/user.service';
import { FooterComponent } from './components/main/footer/footer.component';
import { ProfileComponent } from './components/router/profile/profile.component';
import { OrdersComponent } from './components/router/orders/orders.component';
import { AppRoutingModule } from './app-routing.module';
import { VitsComponent } from './components/router/vits/vits.component';
import { CartComponent } from './components/router/cart/cart.component';
import { SureComponent } from './components/pop-up/sure/sure.component';
import { HelpPopupComponent } from './components/pop-up/help-popup/help-popup.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './store/interceptor/auth.interceptor';
import { AdminModule } from './components/router/admin/admin.module';
import { AdminGuard } from './guards/admin.guard';
import { SpinnerComponent } from './components/ui/spinner/spinner.component';
import { ErrorComponent } from './components/pop-up/error/error.component';
import { DirectiveModule } from './directives/directive.module';
import { ProductService } from './services/product/product.service';
import { ListComponent } from './inheriteds/ListComponent';
import { InjectService } from './services/inject/inject.service';
import { PricePipe } from './pipes/price.pipe';
import { VitCardComponent } from './components/router/vits/vit-card/vit-card.component';
import { PipesModule } from './shared/pipes.module';
import { VitCardDetailsComponent } from './components/router/vits/vit-card-details/vit-card-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    OrdersComponent,
    VitsComponent,
    CartComponent,
    SureComponent,
    HelpPopupComponent,
    ErrorComponent,
    VitCardComponent,
    VitCardDetailsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    AuthModule,
    StoreModule.forRoot(
      {}, 
      {}
    ),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    AuthStoreModule,
    EffectsModule.forRoot([]),
    AppRoutingModule,
    AdminModule,
    DirectiveModule,
    PipesModule
  ],
  providers: [
    UserService,
    ProductService,
    AuthGuard,
    AdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private injector: Injector
  ) {
    InjectService.setInject(this.injector);
  }

}
