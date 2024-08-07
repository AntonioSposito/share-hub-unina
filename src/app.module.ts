import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { StudentsModule } from './students/students.module';
import { ProfessorsModule } from './professors/professors.module';
import { CoursesModule } from './courses/courses.module';
import { FilesModule } from './files/files.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [DatabaseModule, StudentsModule, ProfessorsModule, CoursesModule, FilesModule, ReviewsModule, EnrollmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
