import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees') // Nombre de la tabla en la DB
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;
}
