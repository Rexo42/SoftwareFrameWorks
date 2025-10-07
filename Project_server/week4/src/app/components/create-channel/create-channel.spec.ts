import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CreateChannel } from './create-channel';

describe('CreateGroup', () => {
  let component: CreateChannel;
  let fixture: ComponentFixture<CreateChannel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateChannel],
      imports: [HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChannel);
    component = fixture.componentInstance;
    component.groupList = [
      {
        groupName: 'Group A',
        groupCreator: 'Alice',
        groupID: '1',
        groupWaitList: [],
        channelNames: []
      },
      {
        groupName: 'Group B',
        groupCreator: 'Bob',
        groupID: '2',
        groupWaitList: [],
        channelNames: []
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have groupList with 2 groups', () => {
    expect(component.groupList.length).toBe(2);
  });
  it('should update selectedGroup when a group is selected', () => {
    component.selectedGroup = component.groupList[0];
    fixture.detectChanges();

    expect(component.selectedGroup.groupName).toBe('Group A');
  });
  it('should update channelName model', () => {
    component.channelName = 'Test Channel';
    fixture.detectChanges();
    expect(component.channelName).toBe('Test Channel');
  });
    it('should call createChannel on form submit', () => {
    spyOn(component, 'createChannel');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(component.createChannel).toHaveBeenCalled();
  });
});
