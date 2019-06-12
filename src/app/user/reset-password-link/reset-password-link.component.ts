import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password-link',
  templateUrl: './reset-password-link.component.html',
  styleUrls: ['./reset-password-link.component.css']
})
export class ResetPasswordLinkComponent implements OnInit {

  private email;

  constructor(private _route: ActivatedRoute, private _location: Location) {
    this.email = this._route.snapshot.paramMap.get('email');
   }

  ngOnInit() {
  }

  goBack = () => {
    this._location.back();
  }

}
