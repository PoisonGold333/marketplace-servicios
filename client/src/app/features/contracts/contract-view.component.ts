import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contract-view',
  standalone: true,
  templateUrl: './contract-view.component.html',
  styleUrls: ['./contract-view.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ContractViewComponent implements OnInit {
  contract: any;
  bookingId: string = '';
  signed = false;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') || '';
    this.contractService.getContractByBooking(this.bookingId).subscribe((res: any) => {
      this.contract = res.data;
    });
  }

  sign(role: 'client' | 'provider') {
    this.contractService.signContract(this.contract.id, role).subscribe(() => {
      this.signed = true;
    });
  }
}