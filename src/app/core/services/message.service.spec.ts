import { Message } from '../models/message.model';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    service = new MessageService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit messages when showMessage is called', () => {
    const testMessage: Message= {
      text: 'Test message',
      type: 'success'
    };
    const spy = jest.fn();
    service.message$.subscribe(spy);
    service.showMessage(testMessage.text, testMessage.type);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(testMessage);
  });

});
