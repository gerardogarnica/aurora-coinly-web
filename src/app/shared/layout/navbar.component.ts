import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SharedModule, ButtonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
}
