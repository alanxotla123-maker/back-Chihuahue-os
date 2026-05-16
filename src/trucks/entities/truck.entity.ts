import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn('uuid')
  truckId: string;

  // Número económico o identificador del camión, ej: "CH-001"
  @Column({ unique: true })
  truckNumber: string;

  // Modelo del camión, ej: "Volvo 9800", "Mercedes-Benz Paradiso"
  @Column()
  model: string;

  // Número de placa
  @Column({ unique: true })
  plateNumber: string;

  // Total de asientos del camión
  @Column({ type: 'int' })
  totalSeats: number;


  // Estado del camión: activo, en_mantenimiento, fuera_de_servicio
  @Column({ default: 'activo' })
  status: string;

  // Relación con horarios: un camión puede estar asignado a varios horarios
  @OneToMany(() => Schedule, (schedule) => schedule.truck)
  schedules: Schedule[];
}
