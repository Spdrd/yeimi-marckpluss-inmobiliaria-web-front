import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { IndividualCardComponent } from './individual-card/individual-card.component';

const routes: Routes = [
  // Define your routes here

  { path: "", component: MyprofileComponent },
  { path: "propiedad/:id", component: IndividualCardComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
