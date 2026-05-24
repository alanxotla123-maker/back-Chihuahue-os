import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  reservationId!: string;

  @Column()
  scheduleId!: string;

  @ManyToOne(() => Schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule!: Schedule;

  @Column({ type: 'date' })
  tripDate!: string; // "YYYY-MM-DD"

  @Column({ type: 'int' })
  seatNumber!: number;

  @Column()
  passengerName!  : string;

  @Column({ default: 'booked' })
  status!: string; // 'locked', 'booked', 'cancelled'

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!  : Date | null;
}
