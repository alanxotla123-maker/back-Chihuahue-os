import { IsUUID } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    locationId: string;

    @Column()
    locationName: string;

    @Column()
    locationAddress: string;

    @Column({ unique: true })
    locationCity: string;

    @Column()
    locationState: string;

}
