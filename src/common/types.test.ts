import { describe, it } from 'vitest';
import { expectTypeOf } from 'expect-type';
import type { Brand, Position, Size, IconName } from '@/common/types.ts';

describe('Brand', () => {
  it('branded type retains base type properties', () => {
    type UserId = Brand<string, 'UserId'>;
    expectTypeOf<UserId>().toMatchTypeOf<string>();
    expectTypeOf<string>().not.toExtend<UserId>();
  });

  it('branded types with same base but different brands are not assignable', () => {
    type UserId = Brand<string, 'UserId'>;
    type OrderId = Brand<string, 'OrderId'>;
    expectTypeOf<UserId>().not.toEqualTypeOf<OrderId>();
    expectTypeOf<string>().not.toExtend<UserId>();
    expectTypeOf<string>().not.toExtend<OrderId>();
  });
});

describe('Position', () => {
  it('has readonly x and y number properties', () => {
    expectTypeOf<Position>().toHaveProperty('x').toEqualTypeOf<number>();
    expectTypeOf<Position>().toHaveProperty('y').toEqualTypeOf<number>();
    expectTypeOf<{ x: number; y: number }>().not.toEqualTypeOf<Position>();
  });
});

describe('Size', () => {
  it('has readonly width and height number properties', () => {
    expectTypeOf<Size>().toHaveProperty('width').toEqualTypeOf<number>();
    expectTypeOf<Size>().toHaveProperty('height').toEqualTypeOf<number>();
    expectTypeOf<{ width: number; height: number }>().not.toEqualTypeOf<Size>();
  });
});

describe('IconName', () => {
  it('is a union of expected string literals', () => {
    expectTypeOf<IconName>().toEqualTypeOf<
      | 'about'
      | 'cv'
      | 'projects'
      | 'contact'
      | 'terminal'
      | 'github'
      | 'linkedin'
      | 'email'
      | 'download'
      | 'close'
      | 'maximize'
      | 'minimize'
      | 'restore'
      | 'folder'
      | 'file'
      | 'trash'
      | 'settings'
    >();
  });
});
