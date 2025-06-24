import { Injectable,
    ExecutionContext
 } from "@nestjs/common";
 import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {

    getRequest(context: ExecutionContext): Request {
     if (context.getType() === "rpc") {
         return context.switchToRpc().getContext().req;
     }
     return context.switchToHttp().getRequest();
    }
}