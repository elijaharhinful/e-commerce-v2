import express, { Request, RequestHandler, Response } from "express";
import { sayHelloService } from "../services/greeting.service";
import {Route,Get, Controller, Request as TsoaRequest, Response as TsoaResponse, Tags} from "tsoa";
import { GreetingResponse } from "../interfaces/greeting.interface";


@Route('/api')
export class GreetingController extends Controller {
    @Get()
    public async sayHello(): Promise<GreetingResponse> {
        try {
            const data = await sayHelloService();
            return data;
        } catch (err) {
            this.setStatus(500); // Set the HTTP status code for an error
            throw err;
        }
    }
}