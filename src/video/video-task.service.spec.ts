jest.mock('ioredis', () => {
  class RedisMock {
    options = {};
    publish = jest.fn().mockResolvedValue(1);
    subscribe = jest.fn().mockImplementation((_channel, callback) => callback(null));
    on = jest.fn();
  }

  return { __esModule: true, default: RedisMock };
});

import { VideoTaskService } from './video-task.service';

describe('VideoTaskService callbacks', () => {
  let service: VideoTaskService;
  let task: any;
  let repo: { findOne: jest.Mock; save: jest.Mock };

  beforeEach(() => {
    task = {
      taskId: 'task-1',
      status: 'queued',
      volcResponse: JSON.stringify({ id: 'task-1', status: 'queued' }),
    };
    repo = {
      findOne: jest.fn().mockResolvedValue(task),
      save: jest.fn().mockImplementation(async (value) => value),
    };

    const config = {
      get: jest.fn((key: string) => ({
        VIDEO_CALLBACK_TOKEN: 'test-callback-token',
        REDIS_HOST: 'localhost',
        REDIS_PORT: '6379',
      })[key]),
    };

    service = new VideoTaskService(
      repo as any,
      {} as any,
      {} as any,
      {} as any,
      config as any,
    );
  });

  it('validates the callback token', () => {
    expect(service.isValidCallbackToken('test-callback-token')).toBe(true);
    expect(service.isValidCallbackToken('wrong-token')).toBe(false);
    expect(service.isValidCallbackToken()).toBe(false);
  });

  it('does not apply or publish an identical callback twice', async () => {
    const callback = { id: 'task-1', status: 'running' };

    await expect(service.handleCallback(callback)).resolves.toEqual({
      received: true,
      applied: true,
    });
    await expect(service.handleCallback(callback)).resolves.toEqual({
      received: true,
      applied: false,
    });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect((service as any).redis.publish).toHaveBeenCalledTimes(1);
  });

  it('does not allow a terminal task to be overwritten by a later callback', async () => {
    task.status = 'succeeded';
    task.volcResponse = JSON.stringify({
      id: 'task-1',
      status: 'succeeded',
      content: { video_url: 'https://example.test/video.mp4' },
    });

    await expect(service.handleCallback({ id: 'task-1', status: 'running' })).resolves.toEqual({
      received: true,
      applied: false,
    });

    expect(task.status).toBe('succeeded');
    expect(repo.save).not.toHaveBeenCalled();
    expect((service as any).redis.publish).not.toHaveBeenCalled();
  });

  it('does not allow a lower-priority status to overwrite the current status', async () => {
    task.status = 'running';
    task.volcResponse = JSON.stringify({ id: 'task-1', status: 'running' });

    await expect(service.handleCallback({ id: 'task-1', status: 'queued' })).resolves.toEqual({
      received: true,
      applied: false,
    });

    expect(task.status).toBe('running');
    expect(repo.save).not.toHaveBeenCalled();
  });
});
