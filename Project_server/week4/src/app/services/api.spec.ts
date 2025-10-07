import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NavBar } from '../components/nav-bar/nav-bar';
import { FormsModule } from '@angular/forms';
import { Api } from './api';

describe('Api', () => {
  let service: Api;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Api],
      imports: [HttpClientTestingModule, FormsModule]
    });
    service = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform loginRequest and return token', () => {
  const mockResponse = { success: true, token: 'abc123' };
  const user = { username: 'testuser', password: 'pass' };

  service.loginRequest(user).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne('http://localhost:3000/api/auth');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(user);
  req.flush(mockResponse);
  });

it('should perform createAccountRequest and return token and message', () => {
const mockResponse = { success: true, token: 'xyz789', message: 'Account created' };
const user = { username: 'newuser', password: 'pass' };

service.createAccountRequest(user).subscribe(response => {
  expect(response).toEqual(mockResponse);
});

const req = httpMock.expectOne('http://localhost:3000/api/create');
expect(req.request.method).toBe('POST');
expect(req.request.body).toEqual(user);
req.flush(mockResponse);
});

  it('should perform verifyToken and return user data', () => {
    const mockResponse = {
      valid: true,
      role: 'admin',
      username: 'testuser',
      email: 'test@test.com',
      age: '30',
      birthdate: '1995-01-01',
      profilePicture: 'pic.jpg'
    };
    const token = 'token123';

    service.verifyToken(token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/verify');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.body).toBeNull();

    req.flush(mockResponse);
  });

  it('should perform createGroup and return valid status', () => {
  const mockResponse = { valid: true };
  const groupName = 'My Group';
  const username = 'testuser';

  service.createGroup(groupName, username).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne('http://localhost:3000/api/createGroup');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual({ groupName, username });
  req.flush(mockResponse);
});

it('should perform getGroups with optional useCase and return groups', () => {
  const mockResponse = {
    success: true,
    groups: ['group1', 'group2'],
    ids: ['id1', 'id2'],
    creators: ['creator1', 'creator2'],
    pageLimit: 2,
    waitLists: [['user1'], ['user2']],
    channelNames: [['chan1'], ['chan2']]
  };
  const page = 1;
  const limit = 10;
  const username = 'testuser';
  const useCase = '2';

  service.getGroups(page, limit, username, useCase).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(req => 
    req.url === 'http://localhost:3000/api/getGroups' &&
    req.params.get('page') === page.toString() &&
    req.params.get('limit') === limit.toString() &&
    req.params.get('username') === username &&
    req.params.get('useCase') === useCase
  );

  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});
it('should perform addUserToGroup and return success message', () => {
  const mockResponse = { success: true, message: 'User added' };
  const username = 'testuser';
  const groupName = 'My Group';

  service.addUserToGroup(username, groupName).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(`http://localhost:3000/api/addUser/${groupName}/${username}`);
  expect(req.request.method).toBe('PATCH');
  expect(req.request.body).toEqual({});
  req.flush(mockResponse);
});

it('should perform deleteGroup and return success message', () => {
  const mockResponse = { success: true, message: 'Group deleted' };
  const groupName = 'My Group';

  service.deleteGroup(groupName).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(`http://localhost:3000/api/deleteGroup/${groupName}`);
  expect(req.request.method).toBe('DELETE');
  req.flush(mockResponse);
});

it('should perform createChannel and return valid status', () => {
  const mockResponse = { valid: true };
  const username = 'testuser';
  const groupName = 'My Group';
  const channelName = 'general';

  service.createChannel(username, groupName, channelName).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne('http://localhost:3000/api/createChannel');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual({ username, groupName, channelName });
  req.flush(mockResponse);
});

it('should perform deleteChannel and return valid status and message', () => {
  const mockResponse = { valid: true, message: 'Channel deleted' };
  const username = 'testuser';
  const groupName = 'My Group';
  const channelName = 'general';

  service.deleteChannel(username, groupName, channelName).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(request =>
    request.url === 'http://localhost:3000/api/deleteChannel' &&
    request.params.get('username') === username &&
    request.params.get('groupName') === groupName &&
    request.params.get('channelName') === channelName
  );

  expect(req.request.method).toBe('DELETE');
  req.flush(mockResponse);
});

});
