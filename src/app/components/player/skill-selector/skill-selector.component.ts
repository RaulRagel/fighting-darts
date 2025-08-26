import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Skill } from 'src/app/interfaces/skill';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-skill-selector',
  templateUrl: './skill-selector.component.html',
  styleUrls: ['./skill-selector.component.scss']
})
export class SkillSelectorComponent implements OnInit {

  skills = this.utilsService.getSkills();
  @Output() skillEmitter = new EventEmitter<Skill>();
  @Output() closeEmitter = new EventEmitter<string>();

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    console.log('Skills:', this.skills)
  }

  selectSkill(skill: Skill) {
    console.log('Selected skill:', skill);
    this.skillEmitter.emit(skill);
  }

  closeSelector() {
    this.closeEmitter.emit();
  }
}
