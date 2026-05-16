import { IsOptional, IsUUID } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    locationId: string;

    @Column()
    locationName: string;

    @Column()
    startingLocation: string;

    @Column()
    finalLocation: string;

    @Column()
    IdTruck: string;

    @Column()
    @IsOptional()
    imageUrl?: string;
}
