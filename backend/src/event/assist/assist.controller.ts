import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssistDTO } from '../../dto/events/assist/assist.dto';
import { AssistService } from './assist.service';


@ApiTags('Assists')
@Controller('event/assists')
export class AssistController {
  assistService: AssistService;

  constructor(assistService: AssistService) {
    this.assistService = assistService;
  }

  @Post('/')
  @ApiResponse({ status: 201, description: 'Creates a new assist event' })
  async saveAssistEvent(@Body() assist: AssistDTO) {
    return await this.assistService.saveAssist(assist);
  }


}
