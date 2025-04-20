import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Message } from '../../../core/models/message.model';
import { MessageService } from '../../../core/services/message.service';
import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageService: jest.Mocked<MessageService>;
  let messageSubject: Subject<Message>;

  const testMessage: Message = {
    text: 'Test message',
    type: 'success',
  };

  beforeEach(async () => {
    messageSubject = new Subject<Message>();

    messageService = {
      message$: messageSubject.asObservable()
    } as unknown as jest.Mocked<MessageService>;


    await TestBed.configureTestingModule({
      imports: [CommonModule,MessagesComponent],
      providers: [
        { provide: MessageService, useValue: messageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set message when service emits and clear after 3 seconds', fakeAsync(() => {
    component.ngOnInit();
    messageSubject.next(testMessage);
    fixture.detectChanges();
    expect(component.message).toEqual(testMessage);
    tick(2999);
    expect(component.message).toEqual(testMessage);
    tick(1);
    expect(component.message).toBeNull();
  }));



});
