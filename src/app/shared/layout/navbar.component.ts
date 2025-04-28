import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  faBell = faBell;
  faUser = faUser;
}
