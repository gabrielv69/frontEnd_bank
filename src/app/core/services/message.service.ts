import { Message, MessageType } from '../models/message.model';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Message service
 *
 * @author gvivas on 2025/04/18.
 * @version 1.0
 * @since 1.0.0
 */

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSubject = new Subject<Message>();
  message$ = this.messageSubject.asObservable();

  showMessage(text: string, type: MessageType): void {
    this.messageSubject.next({ text, type });
  }
}
