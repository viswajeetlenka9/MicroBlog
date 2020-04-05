import { TestBed } from '@angular/core/testing';

import { MicroBlogService } from './micro-blog.service';

describe('MicroBlogService', () => {
  let service: MicroBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
