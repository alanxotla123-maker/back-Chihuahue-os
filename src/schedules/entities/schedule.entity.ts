import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';
import { Truck } from '../../trucks/entities/truck.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  scheduleId: string;

  @Column()
  locationId: string;


  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column({ nullable: true })
  truckId: string;

  @ManyToOne(() => Truck, (truck) => truck.schedules, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'truckId' })
  truck: Truck;

  // Día de la semana: 0=Domingo, 1=Lunes, ... 6=Sábado
  @Column({ type: 'int' })
  dayOfWeek: number;

  // Hora de salida formato "08:00"
  @Column()
  departureTime: string;

  // Hora de llegada formato "12:30"
  @Column()
  arrivalTime: string;

  // Duración del viaje "4h 30m"
  @Column()
  duration: string;

  // Precio en MXN
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Asientos disponibles
  @Column({ type: 'int', default: 40 })
  availableSeats: number;

  // Número de paradas (0 = directo)
  @Column({ type: 'int', default: 0 })
  stops: number;

  // Descripción de paradas "Directo", "1 escala", "Multiparada"
  @Column({ default: 'Directo' })
  stopsDescription: string;
}
