import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { MvxService } from './mvx.service';
import { BearerAuthGuard } from 'src/guards/bearer-auth.guard';

@Controller('mvx')
export class MvxController {
  constructor(private mvxService: MvxService) {}

  toObject(data: any) {
    return JSON.parse(
      JSON.stringify(
        data,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
      ),
    );
  }

  private async handleResponse(
    res: Response,
    action: Promise<any>,
    errorMsg?: string,
  ) {
    try {
      const data = await action;
      res.json(this.toObject(data));
    } catch (err) {
      console.error('ERROR:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('/network')
  getNetwork(@Res() res: Response) {
    this.handleResponse(
      res,
      Promise.resolve(this.mvxService.getNetwork()),
      'Error getting network',
    );
  }

  @Get('/economics')
  async getEconomics(@Res() res: Response) {
    this.handleResponse(
      res,
      Promise.resolve(this.mvxService.getEconomics()),
      'Error getting economics',
    );
  }

  @Get('/esdts')
  getESDTs(@Res() res: Response) {
    this.handleResponse(
      res,
      Promise.resolve(this.mvxService.getESDT_Data()),
      'Error getting ESDTs',
    );
  }

  // @UseGuards(BearerAuthGuard)
  @Get('/relay/:endpoint')
  async relayRequest(@Param('endpoint') endpoint: string, @Res() res: Response) {
    try {
      const data = await this.mvxService.handleApiRelay(endpoint);
      res.json(data);
    } catch (error) {
      res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
  }
 
}
