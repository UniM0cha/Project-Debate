export class TopicDataDto {
  private currentReserveId: number;
  private currentTopicName: string;
  private afterTopicName: string;
  private endDate: Date;

  setTopicDataDto(
    _currentReserveId: number,
    _currentTopicName: string,
    _afterTopicName: string,
    _endDate: Date,
  ) {
    this.currentReserveId = _currentReserveId;
    this.currentTopicName = _currentTopicName;
    this.afterTopicName = _afterTopicName;
    this.endDate = _endDate;
  }
}
