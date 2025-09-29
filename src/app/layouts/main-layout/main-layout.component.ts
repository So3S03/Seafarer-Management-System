import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../components/common/nav-bar/nav-bar.component";
import { SeafarerService } from '../../core/services/seafarer.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{
  private readonly _SeafarerService: SeafarerService = inject(SeafarerService);

  ngOnInit(): void {
    this._SeafarerService.subscripEmpsAndVendors()
  }
}
