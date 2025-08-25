import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-skill-selector',
  templateUrl: './skill-selector.component.html',
  styleUrls: ['./skill-selector.component.scss']
})
export class SkillSelectorComponent implements OnInit {

  skills = this.utilsService.getSkills();
  @Output() skillEmitter = new EventEmitter<string>();
  @Output() closeEmitter = new EventEmitter<string>();

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    console.log('Skills:', this.skills)
  }

  selectSkill(skillName: string) {
    console.log('Selected skill:', skillName);
    this.skillEmitter.emit(skillName);
  }

  closeSelector() {
    this.closeEmitter.emit();
  }
}
