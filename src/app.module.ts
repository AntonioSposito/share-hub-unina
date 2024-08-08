import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CoursesModule } from './courses/courses.module';
import { FilesModule } from './files/files.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, CoursesModule, FilesModule, ReviewsModule, EnrollmentsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
