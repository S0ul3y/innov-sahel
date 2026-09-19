import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Décorateur @CurrentUser — extrait l'utilisateur connecté depuis la requête.
 *
 * Injecté par le JwtStrategy après validation du token.
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: UserEntity) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    // Si un champ spécifique est demandé : @CurrentUser('id')
    return data ? user?.[data] : user;
  },
);
