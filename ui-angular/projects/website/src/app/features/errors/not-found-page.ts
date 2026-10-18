import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Button } from '../../shared/ui/button/button';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'iwi-not-found-page',
  imports: [PageHeader, Button, RouterLink],
  templateUrl: './not-found-page.html',
})
export default class NotFoundPage {}
