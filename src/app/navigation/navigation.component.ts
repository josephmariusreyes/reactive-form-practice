import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  
  navigationItems = [
    {
      path: '/reactiveform-test1',
      title: 'Basic Form Array',
      description: 'Simple friends list with basic validation',
      icon: '📝',
      difficulty: 'Beginner'
    },
    {
      path: '/reactiveform-test2',
      title: 'Advanced Form Array',
      description: 'Friends management with add/remove functionality',
      icon: '👥',
      difficulty: 'Intermediate'
    },
    {
      path: '/reactiveform-test3',
      title: 'Different Field Types',
      description: 'User profile with various input types',
      icon: '🎛️',
      difficulty: 'Intermediate'
    },
    {
      path: '/reactiveform-test4',
      title: 'Dynamic Nested Forms',
      description: 'Company & employees with nested skills',
      icon: '🏢',
      difficulty: 'Advanced'
    },
    {
      path: '/reactiveform-test5',
      title: 'Custom Validators',
      description: 'Registration form with complex validation rules',
      icon: '🔐',
      difficulty: 'Advanced'
    },
    {
      path: '/reactiveform-test6',
      title: 'Async Validators',
      description: 'Account setup with real-time validation',
      icon: '⚡',
      difficulty: 'Expert'
    },
    {
      path: '/rxjs-test1',
      title: 'RxJS Practice',
      description: 'Reactive programming examples',
      icon: '🔄',
      difficulty: 'Intermediate'
    }
  ];

  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      case 'expert': return 'difficulty-expert';
      default: return 'difficulty-beginner';
    }
  }
}
